from tensorflow.keras.layers import Input, Conv2D, LeakyReLU, BatchNormalization, Dropout, Concatenate
from tensorflow.keras.models import Model

def build_discriminator(input_shape=(256, 256, 3)):
    inputs = Input(shape=input_shape)

    # First Convolutional Layer
    x = Conv2D(64, 4, strides=2, padding='same')(inputs)
    x = LeakyReLU(alpha=0.2)(x)

    # Second Convolutional Layer
    x = Conv2D(128, 4, strides=2, padding='same')(x)
    x = BatchNormalization()(x)
    x = LeakyReLU(alpha=0.2)(x)

    # Third Convolutional Layer
    x = Conv2D(256, 4, strides=2, padding='same')(x)
    x = BatchNormalization()(x)
    x = LeakyReLU(alpha=0.2)(x)

    # Fourth Convolutional Layer
    x = Conv2D(512, 4, strides=2, padding='same')(x)
    x = BatchNormalization()(x)
    x = LeakyReLU(alpha=0.2)(x)

    # Fifth Convolutional Layer (Optional for deeper architecture)
    x = Conv2D(512, 4, strides=2, padding='same')(x)
    x = BatchNormalization()(x)
    x = LeakyReLU(alpha=0.2)(x)

    # Dropout for Regularization
    x = Dropout(0.3)(x)

    # Output Layer (PatchGAN Design)
    outputs = Conv2D(1, 4, padding='same')(x)  # Linear activation for logits

    return Model(inputs=inputs, outputs=outputs)