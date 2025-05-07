import { DOM } from "./dom.js";

//NOTE: Move the clicked image into modal and show w/description
function moveImageToModal(image) {
  // === [1] Show overlay and disable background scroll ===
  DOM.overlayWrapper.classList.add("overlay--active");
  document.documentElement.classList.add("no-scroll");

  // === [2] Clear existing modal content ===
  DOM.overlayContent.innerHTML = "";

  // === [3] Create modal container + prepare content (optional, add content content if more elements to be added) ===
  const container = document.createElement("div");
  container.classList.add("modal-content");

  // === [4] check
  const description = image.nextElementSibling?.classList.contains(
    "image-description"
  )
    ? image.nextElementSibling
    : null;

  // === [5] put image into modal ===
  container.appendChild(image);

  // === [6] animate if there is description/text
  if (description) {
    description.classList.remove("hidden");

    void description.offsetWidth;

    description.classList.add("animate-in");

    container.appendChild(description);
  }

  // === [7] *refer to the created (STEP 3) modal-content class
  DOM.overlayContent.appendChild(container);
}

// MARK: SRestore the image and hide description
function moveImageBack(image, originalParent) {
  // === [1] Move image back to its original container
  originalParent.appendChild(image);

  // === [2] Makes sur text is back to default (hidden)
  const description = DOM.overlayContent.querySelector(".image-description");

  if (description) {
    description.classList.remove("animate-in");
    description.classList.add("hidden");
    originalParent.appendChild(description);
  }

  // === [3] Hide overlay and \bring background scroll ===
  DOM.overlayWrapper.classList.remove("overlay--active");
  document.documentElement.classList.add("no-scroll");
}

// NOTE: Toggle implementation of the image to and from modal
function toggleImageView(image) {
  const originalParent = image.parentElement;
  image.classList.add("gallery__image--active");

  const handleClose = async () => {
    if (!document.startViewTransition) {
      moveImageBack(image, originalParent);
      image.classList.remove("gallery__image--active");
      return;
    }

    const transition = document.startViewTransition(() =>
      moveImageBack(image, originalParent)
    );
    await transition.finished;
    image.classList.remove("gallery__image--active");
  };

  //IMPORTANT: Use view transition if supported ===
  if (!document.startViewTransition) {
    moveImageToModal(image);
  } else {
    document.startViewTransition(() => moveImageToModal(image));
  }
  //Set up overlay click to close modal
  DOM.overlayWrapper.onclick = handleClose;
}

export { toggleImageView };
