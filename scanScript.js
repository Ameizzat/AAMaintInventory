// Function to handle QR code scanning and data display
function handleQRScan() {
    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            const video = document.createElement("video");
            document.getElementById("cameraView").appendChild(video);
            video.srcObject = stream;
            video.play();

            // Create a canvas element to draw video frames
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            document.getElementById("cameraView").appendChild(canvas);

            // Continuously capture video frames
            setInterval(() => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Process the captured frame to detect QR codes
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    // QR code detected, display its data
                    displayQRData(code.data);
                }
            }, 1000 / 30);
        })
        .catch(function (error) {
            console.error("Error accessing camera:", error);
        });
}

// Function to display QR code data in the UI
function displayQRData(data) {
    const dataSplit = data.split(';'); // Assuming data is semicolon-separated
    if (dataSplit.length === 4) {
        document.getElementById("partNumber").textContent = "Part Number: " + dataSplit[0];
        document.getElementById("description").textContent = "Description: " + dataSplit[1];
        document.getElementById("location").textContent = "Location: " + dataSplit[2];
        document.getElementById("quantity").textContent = "Quantity: " + dataSplit[3];
    } else {
        console.error("Invalid QR code data format");
    }
}

// Attach QR scan event to the "Scan QR" button
document.getElementById("scanButton").addEventListener("click", handleQRScan);

