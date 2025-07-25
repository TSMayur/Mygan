import os
import cv2
import numpy as np

def add_gaussian_noise(image, mean=0, sigma=25):
    """
    Adds Gaussian noise to an image.
    :param image: Input image (numpy array).
    :param mean: Mean of the Gaussian distribution.
    :param sigma: Standard deviation of the Gaussian distribution.
    :return: Noisy image.
    """
    row, col, ch = image.shape
    gauss = np.random.normal(mean, sigma, (row, col, ch))
    noisy_image = image + gauss
    noisy_image = np.clip(noisy_image, 0, 255).astype(np.uint8)  # Clip values to [0, 255]
    return noisy_image

def process_images(clean_dir, noisy_dir, sigma=25):
    """
    Processes all images in the clean directory by adding noise and saving them in the noisy directory.
    :param clean_dir: Path to the directory containing clean images.
    :param noisy_dir: Path to the directory where noisy images will be saved.
    :param sigma: Standard deviation of the Gaussian noise.
    """
    # Create the noisy directory if it doesn't exist
    os.makedirs(noisy_dir, exist_ok=True)

    # Process each image in the clean directory
    for filename in os.listdir(clean_dir):
        clean_path = os.path.join(clean_dir, filename)
        noisy_path = os.path.join(noisy_dir, filename)

        # Read the clean image
        clean_image = cv2.imread(clean_path)

        if clean_image is None:
            print(f"Skipping invalid file: {clean_path}")
            continue

        # Add Gaussian noise
        noisy_image = add_gaussian_noise(clean_image, sigma=sigma)

        # Save the noisy image
        cv2.imwrite(noisy_path, noisy_image)
        print(f"Processed and saved: {noisy_path}")

# Define paths for each split
base_path = "path/to/BSD500"
splits = ["test_images", "train_images", "val_images"]

for split in splits:
    clean_dir = os.path.join(base_path, split, "clean")
    noisy_dir = os.path.join(base_path, split, "noisy")

    # Process images for the current split
    process_images(clean_dir, noisy_dir, sigma=25)

print("All images processed successfully!")