import tensorflow as tf

# Adversarial loss
cross_entropy = tf.keras.losses.BinaryCrossentropy(from_logits=True)

def perceptual_loss(gen_output, target, vgg16):
    """
    Compute perceptual loss using intermediate features from a pre-trained VGG16 model.
    """
    # Preprocess inputs for VGG16 (normalize to ImageNet statistics)
    gen_output_preprocessed = tf.keras.applications.vgg16.preprocess_input((gen_output + 1) * 127.5)
    target_preprocessed = tf.keras.applications.vgg16.preprocess_input((target + 1) * 127.5)

    # Extract features from intermediate layers of VGG16
    gen_features = vgg16(gen_output_preprocessed)
    target_features = vgg16(target_preprocessed)

    # Compute L1 loss between feature maps
    perceptual_loss_value = tf.reduce_mean(tf.abs(target_features - gen_features))
    return perceptual_loss_value

def generator_loss(disc_generated_output, gen_output, target, lambda_l1=100, lambda_perceptual=10, vgg16=None):
    """
    Compute total generator loss with adversarial, L1, and perceptual components.
    """
    # Adversarial loss
    gan_loss = cross_entropy(tf.ones_like(disc_generated_output), disc_generated_output)

    # L1 loss (pixel-wise difference)
    l1_loss = tf.reduce_mean(tf.abs(target - gen_output))

    # Perceptual loss
    if vgg16 is not None:
        perceptual_loss_value = perceptual_loss(gen_output, target, vgg16)
    else:
        perceptual_loss_value = 0.0

    # Total generator loss
    total_gen_loss = gan_loss + (lambda_l1 * l1_loss) + (lambda_perceptual * perceptual_loss_value)
    return total_gen_loss

def discriminator_loss(real_output, fake_output):
    """
    Compute discriminator loss using binary cross-entropy.
    """
    real_loss = cross_entropy(tf.ones_like(real_output), real_output)
    fake_loss = cross_entropy(tf.zeros_like(fake_output), fake_output)
    total_disc_loss = real_loss + fake_loss
    return total_disc_loss