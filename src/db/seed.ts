import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index";
import type { Submission } from "./schema";
import { roasts, submissions } from "./schema";

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "go",
  "rust",
  "ruby",
  "php",
] as const;

const roastTemplates = {
  helpful: [
    "Consider using proper error handling instead of swallowing exceptions.",
    "This function is doing too much. Consider breaking it into smaller units.",
    "Naming could be improved. Be more descriptive with variable names.",
    "Missing type annotations make this harder to maintain.",
    "This could benefit from early returns to reduce nesting.",
    "Consider extracting this logic into a separate utility function.",
    "The cyclomatic complexity here is quite high.",
    "Missing JSDoc comments for public APIs.",
  ],
  sarcastic: [
    "Wow, who needs readability anyway? Not you, apparently.",
    "This code is so clean it sparkles. Oh wait, that's just the bugs.",
    "I've seen better code in a fortune cookie.",
    "Congratulations, you've invented a new kind of spaghetti code.",
    "This is why we can't have nice things.",
    "Are you trying to set a world record for most nested conditionals?",
    "Your variable names are as mysterious as the meaning of life.",
    'This deserves a participation trophy for "Most Creative Bug Implementation".',
  ],
};

function generateCode(language: string): string {
  const templates: Record<string, () => string> = {
    javascript: () => `
function process${faker.word.noun()}(data) {
  let result = null;
  if (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].active) {
        result = data[i].value;
      }
    }
  }
  return result;
}
`,
    typescript: () => `
interface ${faker.word.noun()}Data {
  id: number;
  name: string;
  value: any;
}

function process${faker.word.noun()}(items: ${faker.word.noun()}Data[]): any {
  return items.filter(x => x.id > 0).map(x => x.value);
}
`,
    python: () => `
def process_${faker.word.noun()}(data):
    result = None
    for item in data:
        if item['active']:
            result = item['value']
    return result
`,
    java: () => `
public class ${faker.word.noun()}Service {
    public Object process${faker.word.noun()}(List<Data> data) {
        Object result = null;
        for (Data item : data) {
            if (item.isActive()) {
                result = item.getValue();
            }
        }
        return result;
    }
}
`,
    go: () => `
func Process${faker.word.noun()}(data []Data) interface{} {
    var result interface{}
    for _, item := range data {
        if item.Active {
            result = item.Value
        }
    }
    return result
}
`,
    rust: () => `
fn process_${faker.word.noun()}(data: Vec<Data>) -> Option<Value> {
    let mut result = None;
    for item in data {
        if item.active {
            result = Some(item.value);
        }
    }
    result
}
`,
  };

  const generator = templates[language] || templates.javascript;
  return generator();
}

async function seed() {
  console.log("🌱 Seeding database...");

  const insertedSubmissions: Submission[] = [];

  for (let i = 0; i < 100; i++) {
    const language = faker.helpers.arrayElement(languages);
    const roastMode = faker.helpers.arrayElement([
      "helpful",
      "sarcastic",
    ] as const);

    const [submission] = await db
      .insert(submissions)
      .values({
        code: generateCode(language),
        language,
        roastMode,
      })
      .returning();

    insertedSubmissions.push(submission);
  }

  console.log(`✅ Created ${insertedSubmissions.length} submissions`);

  const insertedRoasts = [];

  for (const submission of insertedSubmissions) {
    const roastMode = submission.roastMode ?? "sarcastic";
    const templates = roastTemplates[roastMode];
    const roastContent = faker.helpers.arrayElement(templates);
    const score = faker.number.int({ min: 10, max: 99 });

    const [roast] = await db
      .insert(roasts)
      .values({
        submissionId: submission.id,
        roastContent: roastContent,
        score: score,
        roastMode: roastMode,
      })
      .returning();

    insertedRoasts.push(roast);
  }

  console.log(`✅ Created ${insertedRoasts.length} roasts`);
  console.log("🎉 Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
