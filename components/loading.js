const loadingOverlay = document.getElementById('loadingOverlay');
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hiddenLoading() {
    loadingOverlay.classList.remove('active');
}