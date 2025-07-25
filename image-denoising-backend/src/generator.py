from tensorflow.keras.layers import Input, Conv2D, UpSampling2D, Concatenate, BatchNormalization, Activation, Add
from tensorflow.keras.models import Model

def residual_block(x, filters, kernel_size=3, strides=1):
    """
    Residual block to preserve spatial information and improve gradient flow.
    """
    shortcut = x  # Skip connection

    x = Conv2D(filters, kernel_size, strides=strides, padding='same')(x)
    x = BatchNormalization()(x)
    x = Activation('relu')(x)

    x = Conv2D(filters, kernel_size, strides=strides, padding='same')(x)
    x = BatchNormalization()(x)

    # Add skip connection
    x = Add()([x, shortcut])
    x = Activation('relu')(x)

    return x

def build_generator(input_shape=(256, 256, 3)):
    inputs = Input(shape=input_shape)

    # Encoder
    conv1 = Conv2D(64, 4, strides=2, padding='same')(inputs)
    conv1 = BatchNormalization()(conv1)
    conv1 = Activation('relu')(conv1)

    conv2 = Conv2D(128, 4, strides=2, padding='same')(conv1)
    conv2 = BatchNormalization()(conv2)
    conv2 = Activation('relu')(conv2)

    conv3 = Conv2D(256, 4, strides=2, padding='same')(conv2)
    conv3 = BatchNormalization()(conv3)
    conv3 = Activation('relu')(conv3)

    # Bottleneck with residual blocks
    bottleneck = Conv2D(512, 4, strides=2, padding='same')(conv3)
    bottleneck = BatchNormalization()(bottleneck)
    bottleneck = Activation('relu')(bottleneck)

    # Adding residual blocks in the bottleneck for better feature extraction
    bottleneck = residual_block(bottleneck, filters=512)
    bottleneck = residual_block(bottleneck, filters=512)

    # Decoder
    deconv1 = UpSampling2D(size=(2, 2))(bottleneck)
    deconv1 = Conv2D(256, 4, padding='same')(deconv1)
    deconv1 = BatchNormalization()(deconv1)
    deconv1 = Concatenate()([deconv1, conv3])  # Skip connection
    deconv1 = Activation('relu')(deconv1)

    deconv2 = UpSampling2D(size=(2, 2))(deconv1)
    deconv2 = Conv2D(128, 4, padding='same')(deconv2)
    deconv2 = BatchNormalization()(deconv2)
    deconv2 = Concatenate()([deconv2, conv2])  # Skip connection
    deconv2 = Activation('relu')(deconv2)

    deconv3 = UpSampling2D(size=(2, 2))(deconv2)
    deconv3 = Conv2D(64, 4, padding='same')(deconv3)
    deconv3 = BatchNormalization()(deconv3)
    deconv3 = Concatenate()([deconv3, conv1])  # Skip connection
    deconv3 = Activation('relu')(deconv3)

    # Final upsampling to 256x256
    deconv4 = UpSampling2D(size=(2, 2))(deconv3)
    outputs = Conv2D(3, 4, padding='same', activation='tanh')(deconv4)

    return Model(inputs=inputs, outputs=outputs)