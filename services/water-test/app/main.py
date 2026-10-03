from fastapi import FastAPI

app = FastAPI(
    title="GBF Water Test Service",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "gbf-water-test",
    }