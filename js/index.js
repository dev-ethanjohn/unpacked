const overlayWrapper = document.getElementById("js-overlay");
const overlayContent = document.getElementById("js-overlay-target");

function toggleImageView(clickedImage) {
  const image = clickedImage;
  image.classList.add("gallery__image--active");

  const imageParentElement = image.parentElement;

  if (!document.startViewTransition) {
    moveImageToModal(image);
    return;
  }

  document.startViewTransition(() => moveImageToModal(image));

  overlayWrapper._transitionHandler = async () => {
    if (!document.startViewTransition) {
      moveImageBackFromModal(imageParentElement);
      return;
    }

    const transition = document.startViewTransition(() =>
      moveImageBackFromModal(imageParentElement)
    );

    await transition.finished;
    image.classList.remove("gallery__image--active");
  };

  overlayWrapper.onclick = overlayWrapper._transitionHandler;
}

function moveImageToModal(image) {
  overlayWrapper.classList.add("overlay--active");
  overlayContent.innerHTML = "";

  const caption = image.parentElement.querySelector(".image-description");

  overlayContent.appendChild(image);

  if (caption) {
    caption.classList.remove("hidden");
    caption.classList.add("animate-in");
    overlayContent.appendChild(caption);
  }
}

function moveImageBackFromModal(imageParentElement) {
  const image = overlayContent.querySelector("img");
  const caption = overlayContent.querySelector(".image-description");

  imageParentElement.appendChild(image);

  if (caption) {
    caption.classList.remove("animate-in");
    caption.classList.add("hidden");
    imageParentElement.appendChild(caption);
  }

  overlayWrapper.classList.remove("overlay--active");
}
