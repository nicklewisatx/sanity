import { NextResponse } from "next/server";

export async function GET() {
  const axiomToken = process.env.AXIOM_API_TOKEN;
  const axiomDataset = process.env.AXIOM_DATASET;
  const axiomDomain = process.env.AXIOM_DOMAIN || "api.axiom.co";

  if (!axiomToken || !axiomDataset) {
    return NextResponse.json(
      {
        error: "Axiom not configured",
        config: {
          hasToken: !!axiomToken,
          dataset: axiomDataset,
          domain: axiomDomain,
        },
      },
      { status: 400 },
    );
  }

  try {
    // First, check if the dataset exists
    const datasetResponse = await fetch(
      `https://${axiomDomain}/v1/datasets/${axiomDataset}`,
      {
        headers: {
          Authorization: `Bearer ${axiomToken}`,
        },
      },
    );

    if (!datasetResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to access dataset",
          status: datasetResponse.status,
          message: await datasetResponse.text(),
        },
        { status: 400 },
      );
    }

    const datasetInfo = await datasetResponse.json();

    // Query for recent traces
    const queryResponse = await fetch(
      `https://${axiomDomain}/v1/datasets/${axiomDataset}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apl: `dataset | where _time > ago(5m) | where service.name == "${process.env.OTEL_SERVICE_NAME || "unknown"}" | limit 20`,
          startTime: new Date(Date.now() - 300000).toISOString(), // Last 5 minutes
          endTime: new Date().toISOString(),
        }),
      },
    );

    if (!queryResponse.ok) {
      return NextResponse.json(
        {
          error: "Query failed",
          status: queryResponse.status,
          message: await queryResponse.text(),
        },
        { status: 400 },
      );
    }

    const queryData = await queryResponse.json();

    // Also check for any traces at all in the last hour
    const allTracesResponse = await fetch(
      `https://${axiomDomain}/v1/datasets/${axiomDataset}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apl: `dataset | where _time > ago(1h) | summarize count = count()`,
          startTime: new Date(Date.now() - 3600000).toISOString(), // Last hour
          endTime: new Date().toISOString(),
        }),
      },
    );

    const allTracesData = await allTracesResponse.json();

    return NextResponse.json({
      success: true,
      dataset: {
        name: datasetInfo.name,
        created: datasetInfo.created,
      },
      recentTraces: {
        count: queryData.matches?.length || 0,
        serviceName: process.env.OTEL_SERVICE_NAME,
        traces: queryData.matches?.slice(0, 5).map((trace: any) => ({
          timestamp: trace._time,
          traceId: trace.trace?.trace_id,
          spanName: trace.name,
          serviceName: trace.service?.name,
          attributes: trace.attributes,
        })),
      },
      totalTracesLastHour: allTracesData.buckets?.[0]?.count || 0,
      config: {
        serviceName: process.env.OTEL_SERVICE_NAME,
        exporter: process.env.OTEL_EXPORTER,
        enabled: process.env.OTEL_ENABLED,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check Axiom",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
