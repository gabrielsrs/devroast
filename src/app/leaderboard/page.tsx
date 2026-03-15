import { CodeBlock } from "@/components/ui/code-block";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    score: "2.1",
    author: "dev_anon_1",
    language: "javascript",
    code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  },
  {
    rank: 2,
    score: "3.5",
    author: "rustacean_2024",
    language: "rust",
    code: `fn main() {
    let x = 5;
    println!("{}", x);
}`,
  },
  {
    rank: 3,
    score: "4.2",
    author: "python_dev",
    language: "python",
    code: `def get_user(id):
    user = db.query("SELECT * FROM users WHERE id = " + id)
    return user`,
  },
  {
    rank: 4,
    score: "5.0",
    author: "go_guru",
    language: "go",
    code: `func ProcessData(data []byte) error {
    result := string(data)
    return nil
}`,
  },
  {
    rank: 5,
    score: "5.8",
    author: "java_coder",
    language: "java",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`,
  },
];

const TOTAL_SUBMISSIONS = 2847;
const AVG_SCORE = "4.2";

export const metadata = {
  title: "Shame Leaderboard | devroast",
  description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-jetbrains text-[32px] font-[700] text-accent-green">
            {">"}
          </span>
          <h1 className="font-jetbrains text-[28px] font-[700] text-text-primary">
            shame_leaderboard
          </h1>
        </div>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} the most roasted code on the internet
        </p>
        <div className="flex items-center gap-2">
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            {TOTAL_SUBMISSIONS.toLocaleString()} submissions
          </span>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            ·
          </span>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            avg score: {AVG_SCORE}/10
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {LEADERBOARD_DATA.map((entry) => (
          <div
            key={entry.rank}
            className="flex flex-col gap-0 rounded-none border border-border"
          >
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-red/20 font-jetbrains text-[14px] font-[700] text-accent-red">
                  #{entry.rank}
                </div>
                <span className="font-jetbrains text-[13px] text-text-secondary">
                  {entry.author}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-jetbrains text-[12px] text-text-tertiary">
                  {entry.language}
                </span>
                <span className="font-jetbrains text-[14px] font-[700] text-accent-red">
                  {entry.score}/10
                </span>
              </div>
            </div>
            <CodeBlock
              code={entry.code}
              showLineNumbers={true}
              className="rounded-none border-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
