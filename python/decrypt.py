import base64
from pyDes import *
import sys


def decrypt_url(url):
    des_cipher = des(b"38346591", ECB, b"\0\0\0\0\0\0\0\0",
                     pad=None, padmode=PAD_PKCS5)
    enc_url = base64.b64decode(url.strip())
    dec_url = des_cipher.decrypt(enc_url, padmode=PAD_PKCS5).decode('utf-8')
    dec_url = dec_url.replace("_96.mp4", "_320.mp4")
    return dec_url


def main():
    incomingURL = sys.argv[1]
    decryptedMedia = decrypt_url(incomingURL)
    print(decryptedMedia)
    sys.stdout.flush()


if __name__ == '__main__':
    main()
