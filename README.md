openmediavault-acme
==========================

Using the power of Let's Encrypt, generate valid SSL certificates for your OpenMediaVault.
Your SSL certificate will be recognized by the majority of browsers.

This fork of the famous letsencrpyt-plugin uses the wonderful acme.sh implementation instead of certbot. This way, you can use the DNS-APIs provided for the ACME-Challenge and create wildcard certificates for instance.

More Information: [ACME Homepage](https://acme.sh/)

The key principles behind Let’s Encrypt are:

   * Free: Anyone who owns a domain name can use Let’s Encrypt to obtain a trusted certificate at zero cost.
   * Automatic: Software running on a web server can interact with Let’s Encrypt to painlessly obtain a certificate, securely configure it for use, and automatically take care of renewal.
   * Secure: Let’s Encrypt will serve as a platform for advancing TLS security best practices, both on the CA side and by helping site operators properly secure their servers.
   * Transparent: All certificates issued or revoked will be publicly recorded and available for anyone to inspect.
   * Open: The automatic issuance and renewal protocol will be published as an open standard that others can adopt.
   * Cooperative: Much like the underlying Internet protocols themselves, Let’s Encrypt is a joint effort to benefit the community, beyond the control of any one organization.

[Linux Foundation: Let's Encrypt Homepage](https://letsencrypt.org/)
