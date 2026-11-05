
// TruthCheck - Fake News Detector

async function checkNews() {

    const newsInput = document.getElementById("news");
    const result = document.getElementById("result");
    const status = document.getElementById("status");
    const message = document.getElementById("message");
    const score = document.getElementById("score");

    const news = newsInput.value.trim();

    // Check empty input
    if (news.length < 20) {
        alert("Please enter a news article of at least 20 characters.");
        return;
    }

    // Loading message
    result.style.display = "block";
    result.style.background = "#dbeafe";
    result.style.color = "#1e40af";

    status.innerText = "Analyzing News...";
    message.innerText = "Please wait while our AI checks the article.";
    score.innerText = "";

    try {

        // Connect to Flask backend
        const response = await fetch("/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                news: news
            })

        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display prediction
        if (data.prediction === "FAKE") {

            status.innerText = "⚠ FAKE NEWS";
            message.innerText =
                "The machine learning model classified this news as potentially fake.";

            result.style.background = "#fee2e2";
            result.style.color = "#991b1b";

        } else {

            status.innerText = "✓ LIKELY REAL";
            message.innerText =
                "The machine learning model classified this news as likely real.";

            result.style.background = "#dcfce7";
            result.style.color = "#166534";

        }

        score.innerText =
            "Model confidence: " +
            (data.confidence !== undefined
                ? data.confidence + "%"
                : "Not available");

    } catch (error) {

        status.innerText = "❌ Error";
        message.innerText =
            "Unable to connect to the server. Please check whether Flask is running.";

        score.innerText = "";

        result.style.background = "#fef3c7";
        result.style.color = "#92400e";

        console.error(error);
    }
}
