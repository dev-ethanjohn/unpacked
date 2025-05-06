// // handlers.js
// import { overlayWrapper, overlayContent } from "./dom.js";

// export function moveImageToModal(image) {
//   overlayWrapper.classList.add("overlay--active");
//   overlayContent.append(image);
// }

// export function moveImageToGrid(imageParentElement) {
//   const image = overlayContent.querySelector("img");
//   if (image) {
//     imageParentElement.append(image);
//   }
//   overlayWrapper.classList.remove("overlay--active");
// }

// export function toggleImageView(index, getImage) {
//   const image = getImage(index);
//   image.classList.add("gallery__image--active");

//   const imageParent = image.parentElement;

//   const handleClose = async () => {
//     if (!document.startViewTransition) {
//       moveImageToGrid(imageParent);
//       image.classList.remove("gallery__image--active");
//       return;
//     }

//     const transition = document.startViewTransition(() =>
//       moveImageToGrid(imageParent)
//     );

//     await transition.finished;
//     image.classList.remove("gallery__image--active");
//   };

//   if (!document.startViewTransition) {
//     moveImageToModal(image);
//   } else {
//     document.startViewTransition(() => moveImageToModal(image));
//   }

//   overlayWrapper.onclick = handleClose;
// }

import { DOM } from "./dom.js";

function moveImageToModal(image) {
  DOM.overlayWrapper.classList.add("overlay--active");
  DOM.overlayContent.append(image);
}

function moveImageBack(image, originalParent) {
  originalParent.append(image);
  DOM.overlayWrapper.classList.remove("overlay--active");
}

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

  if (!document.startViewTransition) {
    moveImageToModal(image);
  } else {
    document.startViewTransition(() => moveImageToModal(image));
  }

  DOM.overlayWrapper.onclick = handleClose;
}

export { toggleImageView };
