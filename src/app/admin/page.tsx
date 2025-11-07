
import Card from "@/components/web/UI/Card";
import path from "path";
import { promises as fs } from "fs";

export default async function AdminPage() {
  // Pick the file to read from src/static
  const fileName = "Төрийн мэдээлэл-2025 он.json";
  const filePath = path.join(process.cwd(), "src", "static", fileName);
  let data: unknown = null;
  let error: string | null = null;

  try {
    const file = await fs.readFile(filePath, "utf-8");
    data = JSON.parse(file);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", color: "#000" }}>
      <h1 style={{ color: "#000" }}>Admin - JSON Data View</h1>
      <Card title={`Static JSON: ${fileName}`}>
        <div style={{ minHeight: 60, color: "#000" }}>
          {error ? (
            <div style={{ color: "crimson" }}>Error: {error}</div>
          ) : Array.isArray(data) ? (
            data.map((item, index) => (
              <p key={index}>{JSON.stringify(item)}</p>
            ))
          ) : data && typeof data === "object" ? (
            Object.entries(data as Record<string, unknown>).map(([key, value], index) => (
              <p key={index}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </p>
            ))
          ) : (
            <span>No data found.</span>
          )}
        </div>
      </Card>
    </main>
  );
}
