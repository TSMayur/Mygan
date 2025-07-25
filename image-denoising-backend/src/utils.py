import os
import cv2
import numpy as np
from skimage.metrics import peak_signal_noise_ratio as psnr
def add_gaussian_noise(image, mean=0, sigma=25):
    row, col, ch = image.shape
    gauss = np.random.normal(mean, sigma, (row, col, ch))
    noisy_image = image + gauss
    noisy_image = np.clip(noisy_image, 0, 255).astype(np.uint8)
    return noisy_image

def process_images(clean_dir, noisy_dir, img_size=256):
    os.makedirs(noisy_dir, exist_ok=True)
    for filename in os.listdir(clean_dir):
        clean_path = os.path.join(clean_dir, filename)
        noisy_path = os.path.join(noisy_dir, filename)

        clean_img = cv2.imread(clean_path)
        if clean_img is None:
            continue

        clean_img = cv2.resize(clean_img, (img_size, img_size))
        noisy_img = add_gaussian_noise(clean_img)

        cv2.imwrite(os.path.join(noisy_dir, filename), noisy_img)

# Example usage
if __name__ == "__main__":
    base_path = "data"
    splits = ["train", "val", "test"]
    for split in splits:
        clean_dir = os.path.join(base_path, split, "clean")
        noisy_dir = os.path.join(base_path, split, "noisy")
        process_images(clean_dir, noisy_dir)

def evaluate_model(generator, test_noisy, test_clean):
    predictions = generator.predict(test_noisy)
    psnr_scores = [psnr(clean, pred) for clean, pred in zip(test_clean, predictions)]
    return np.mean(psnr_scores)

def load_and_preprocess_data(noisy_dir, clean_dir, img_size=256):
    noisy_images = []
    clean_images = []

    for filename in os.listdir(noisy_dir):
        noisy_path = os.path.join(noisy_dir, filename)
        clean_path = os.path.join(clean_dir, filename)

        noisy_img = cv2.imread(noisy_path)
        clean_img = cv2.imread(clean_path)

        if noisy_img is None or clean_img is None:
            continue

        # Resize images to the desired size (256x256)
        noisy_img = cv2.resize(noisy_img, (img_size, img_size))
        clean_img = cv2.resize(clean_img, (img_size, img_size))

        # Normalize pixel values to [-1, 1] and ensure dtype is float32
        noisy_img = ((noisy_img / 127.5) - 1.0).astype(np.float32)
        clean_img = ((clean_img / 127.5) - 1.0).astype(np.float32)

        noisy_images.append(noisy_img)
        clean_images.append(clean_img)

    return np.array(noisy_images), np.array(clean_images)

