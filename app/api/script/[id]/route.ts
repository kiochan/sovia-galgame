import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "data", "scripts", `${id}.json`);
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }
}
