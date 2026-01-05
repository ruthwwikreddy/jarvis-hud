const fs = require('fs');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');

const imagePath = process.argv[2] || 'src/assets/ruthwwikreddy.png';

fs.createReadStream(imagePath)
    .pipe(new PNG())
    .on('parsed', function() {
        const imageData = {
            data: new Uint8ClampedArray(this.width * this.height * 4),
            width: this.width,
            height: this.height
        };

        // Convert PNG data to RGBA format for jsQR
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                imageData.data[idx] = this.data[idx];
                imageData.data[idx + 1] = this.data[idx + 1];
                imageData.data[idx + 2] = this.data[idx + 2];
                imageData.data[idx + 3] = this.data[idx + 3];
            }
        }

        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            console.log('\n✅ QR Code decoded successfully!\n');
            console.log('Full URL:', code.data);
            console.log('\n---\n');

            // Parse TOTP URL: otpauth://totp/Service:email?secret=XXX&issuer=Service
            const url = new URL(code.data);
            
            if (url.protocol === 'otpauth:') {
                const pathParts = url.pathname.split(':');
                const label = pathParts[1] || pathParts[0].replace('/totp/', '');
                const params = url.searchParams;
                const secret = params.get('secret');
                const issuer = params.get('issuer') || pathParts[0].replace('/totp/', '');

                console.log('📋 Extracted Information:');
                console.log('------------------------');
                console.log('Account:', label);
                console.log('Issuer:', issuer);
                console.log('Secret:', secret);
                console.log('\n');

                console.log('📝 Add this to your hudData.js:');
                console.log('--------------------------------');
                console.log('authenticator: {');
                console.log('    accounts: [');
                console.log('        {');
                console.log(`            name: "${label}",`);
                console.log(`            issuer: "${issuer}",`);
                console.log(`            secret: "${secret}"`);
                console.log('        }');
                console.log('    ]');
                console.log('}');
            } else {
                console.log('⚠️  Not a standard TOTP URL format');
            }
        } else {
            console.error('❌ Failed to decode QR code');
        }
    })
    .on('error', (err) => {
        console.error('❌ Error reading image:', err.message);
    });
