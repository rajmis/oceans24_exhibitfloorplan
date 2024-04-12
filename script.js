
// Load booths data and populate logo grid
document.addEventListener('DOMContentLoaded', function() {
    fetch('booths.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n').slice(1); // Skip header row
            const logoGrid = document.getElementById('logo-grid');

            rows.forEach(row => {
                const [fullName, companyName, boothNumber, x, y, width, height, description] = row.split(',');
                const logoLink = document.createElement('a');
                logoLink.href = "#";
                logoLink.setAttribute("onclick", `highlightArea(${x}, ${y}, ${width}, ${height}, '${companyName}', '${fullName}')`);

                const logoImg = document.createElement('img');
                logoImg.src = `company_logos_webp/${companyName}.webp`; // Assuming logo filenames match company names
                logoImg.alt = fullName;
                logoImg.className = 'logo';

                logoLink.appendChild(logoImg);
                logoGrid.appendChild(logoLink);
            });
        })
        .catch(error => console.error('Error loading booths data:', error));
});

function highlightArea(x1, y1, x2, y2, companyName, fullName) {
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;

    var image = document.getElementById("myImage");
    var imageWidth = image.naturalWidth;
    var imageHeight = image.naturalHeight;

    if (screenWidth > 768) {
        var containerWidth = document.getElementById("myImage").offsetWidth;
        var containerHeight = document.getElementById("myImage").offsetHeight;
        // Calculate the scaling factors based on the smaller dimension of the container
        var widthScale = containerWidth / imageWidth;
        var heightScale = containerHeight / imageHeight;
        // Calculate the position and size of the overlay relative to the image dimensions
        var xPercent = (x1 / containerWidth) * 100 * widthScale;
        var yPercent = (y1 / containerHeight) * 100 * heightScale * containerHeight/screenHeight;
        var widthPercent = ((x2-x1) / containerWidth) * 100 * widthScale;
        var heightPercent = ((y2-y1) / containerHeight) * 100 * heightScale * containerHeight/screenHeight;
    }
    else {
        var containerWidth = document.getElementById("image-container").offsetWidth;
        var containerHeight = document.getElementById("image-container").offsetHeight;
        // Calculate the scaling factors based on the smaller dimension of the container
        var widthScale = containerWidth / imageWidth;
        var heightScale = containerHeight / imageHeight;
        // Calculate the position and size of the overlay relative to the image dimensions
    
        scale = Math.max(widthScale, heightScale);
        var xPercent = (x1 / containerWidth) * 100 * scale;
        var yPercent = (y1 / containerHeight) * 100 * scale;
        var widthPercent = ((x2-x1) / containerWidth) * 100 * scale;
        var heightPercent = ((y2-y1) / containerHeight) * 100 * scale;
    }

    // Apply the overlay position and size
    var overlay = document.getElementById("overlay");
    overlay.style.left = xPercent + "%";
    overlay.style.top = yPercent + "%";
    overlay.style.width = widthPercent + "%";
    overlay.style.height = heightPercent + "%";

    // Scroll to the highlighted area if it's not currently in the viewport
    var container = document.getElementById("image-container");
    var overlayRect = overlay.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();

    if (overlayRect.top < containerRect.top || overlayRect.bottom > containerRect.bottom) {
        container.scrollTo({
            top: overlay.offsetTop - (container.clientHeight - overlay.clientHeight) / 2,
            behavior: 'smooth'
        });
    }

    // Fetch booth data from booths.csv and populate description area
    fetch('booths.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.trim().split('\n').slice(1); // Skip header row
            rows.forEach(row => {
                const [ ,csvCompanyName, boothNumber, , , , , description] = row.split(',');
                if (csvCompanyName === companyName) {
                    document.getElementById("companyName").innerText = "Exhibitor: " + capitalizeName(fullName);
                    document.getElementById("boothNumber").innerText = "Booth #: " + boothNumber;
                    document.getElementById("description").innerText = "Contact: " + description;
                }
            });
        })
        .catch(error => console.error('Error loading booths data:', error));
}

function capitalizeName(name) {
    // Split the name into words
    let words = name.toLowerCase().split(' ');

    // Capitalize the first letter of each word
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    // Join the words back together with a space separator
    return words.join(' ');
}

// Function to filter logos based on the entered company name
function filterLogos(searchText) {
    const logos = document.querySelectorAll('.logo');
    const searchTerm = searchText.toLowerCase();

    logos.forEach(logo => {
        const companyName = logo.alt.toLowerCase();
        const logoLink = logo.parentElement;

        if (companyName.includes(searchTerm)) {
            logoLink.style.display = 'block'; // Show the logo if the company name matches the search term
        } else {
            logoLink.style.display = 'none'; // Hide the logo if the company name does not match the search term
        }
    });
}

// Event listener for the search bar input changes
document.getElementById('search').addEventListener('input', function(event) {
    const searchText = event.target.value;
    filterLogos(searchText);
});