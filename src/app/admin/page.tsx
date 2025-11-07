import React from "react";
import { getDatabase } from "@/lib/database";
import Card from "@/components/web/Card";

type DbStatus = {
  ok: number;
} | {
  error: string;
};

export default async function AdminPage() {
  let status: DbStatus = { error: "unknown" };

  try {
    // Use env DB name if provided, otherwise use 'admin'
    const dbName = process.env.MONGO_DB_NAME || "admin";
    const db = await getDatabase(dbName);

    // Run a ping command to ensure connectivity
    // The MongoDB Node driver supports db.command({ ping: 1 }) which returns { ok: 1 } on success
    // If the command fails an exception will be thrown and caught below
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await (db.command as any)({ ping: 1 }));

    if (res && typeof res.ok === "number") {
      status = { ok: res.ok };
    } else {
      status = { error: "unexpected response" };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    status = { error: message };
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>Admin</h1>
      <Card title="Database connection status">
        <div style={{ minHeight: 60 }}>
          {"ok" in status ? (
            <div style={{ color: status.ok === 1 ? "green" : "orange" }}>
              Connected (ok: {status.ok})
            </div>
          ) : (
            <div style={{ color: "crimson" }}>Not connected: {status.error}</div>
          )}
        </div>
      </Card>
    </main>
  );
}
