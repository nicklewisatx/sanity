import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.AXIOM_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Missing API token" });
  }

  try {
    const response = await fetch("https://api.axiom.co/v1/datasets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        error: "Failed to list datasets",
        status: response.status,
        message: await response.text(),
      });
    }

    const datasets = await response.json();

    return NextResponse.json({
      success: true,
      count: datasets.length,
      datasets: datasets.map((d: any) => ({
        name: d.name,
        created: d.created,
        description: d.description,
      })),
      currentDataset: process.env.AXIOM_DATASET,
      exists: datasets.some((d: any) => d.name === process.env.AXIOM_DATASET),
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch datasets",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST() {
  const token = process.env.AXIOM_API_TOKEN;
  const datasetName = process.env.AXIOM_DATASET || "dev-traces";

  if (!token) {
    return NextResponse.json({ error: "Missing API token" });
  }

  try {
    const response = await fetch("https://api.axiom.co/v1/datasets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: datasetName,
        description: "OpenTelemetry traces for Sanity Next.js development",
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        error: "Failed to create dataset",
        status: response.status,
        message: await response.text(),
      });
    }

    const dataset = await response.json();

    return NextResponse.json({
      success: true,
      message: `Dataset '${datasetName}' created successfully`,
      dataset,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create dataset",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
