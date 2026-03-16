import { RoastFormServer } from "@/components/roast-form-server";

export const metadata = {
  title: "Roast Your Code | devroast",
  description: "Submit your code and get brutally roasted",
};

export default function RoastPage() {
  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-jetbrains text-[32px] font-[700] text-accent-green">
            {">"}
          </span>
          <h1 className="font-jetbrains text-[28px] font-[700] text-text-primary">
            new_roast
          </h1>
        </div>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} submit your code for analysis
        </p>
      </div>

      <RoastFormServer />
    </div>
  );
}
