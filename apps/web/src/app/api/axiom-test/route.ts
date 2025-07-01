import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.AXIOM_API_TOKEN;
  const dataset = process.env.AXIOM_DATASET;

  if (!token || !dataset) {
    return NextResponse.json({ error: "Missing credentials" });
  }

  try {
    // Test 1: List datasets
    const datasetsResponse = await fetch("https://api.axiom.co/v1/datasets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!datasetsResponse.ok) {
      return NextResponse.json({
        error: "Failed to list datasets",
        status: datasetsResponse.status,
        message: await datasetsResponse.text(),
      });
    }

    const datasets = await datasetsResponse.json();

    // Test 2: Ingest a test event
    const testEvent = {
      _time: new Date().toISOString(),
      test: true,
      message: "OpenTelemetry test event",
      service: process.env.OTEL_SERVICE_NAME,
    };

    const ingestResponse = await fetch(
      `https://api.axiom.co/v1/datasets/${dataset}/ingest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([testEvent]),
      },
    );

    if (!ingestResponse.ok) {
      return NextResponse.json({
        error: "Failed to ingest test event",
        status: ingestResponse.status,
        message: await ingestResponse.text(),
        dataset: dataset,
      });
    }

    const ingestResult = await ingestResponse.json();

    return NextResponse.json({
      success: true,
      datasets: datasets.map((d: any) => d.name),
      targetDataset: dataset,
      datasetExists: datasets.some((d: any) => d.name === dataset),
      ingestResult,
      testEvent,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to test Axiom",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
