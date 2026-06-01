module.exports = ({ env }) => {
  // S3-compatible upload (R2/Tigris) when AWS_BUCKET is set. Fail fast at boot
  // if the bucket is configured but its required credentials/endpoint are
  // missing, rather than surfacing opaque upload errors at runtime.
  const bucket = env('AWS_BUCKET');
  if (bucket) {
    const missing = ['AWS_ACCESS_KEY_ID', 'AWS_ACCESS_SECRET', 'AWS_ENDPOINT'].filter(
      (key) => !env(key)
    );
    if (missing.length) {
      throw new Error(
        `AWS_BUCKET is set but required S3 upload env is missing: ${missing.join(', ')}`
      );
    }
  }

  return {
    seo: {
      enabled: true,
    },
    // Local dev leaves AWS_BUCKET unset → falls back to the default local provider.
    ...(bucket
      ? {
        upload: {
          config: {
            provider: 'aws-s3',
            providerOptions: {
              baseUrl: env('CDN_URL'),
              s3Options: {
                credentials: {
                  accessKeyId: env('AWS_ACCESS_KEY_ID'),
                  secretAccessKey: env('AWS_ACCESS_SECRET'),
                },
                region: env('AWS_REGION', 'us-east-1'),
                endpoint: env('AWS_ENDPOINT'),
                forcePathStyle: env.bool('AWS_FORCE_PATH_STYLE', true),
                params: {
                  Bucket: env('AWS_BUCKET'),
                },
              },
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          },
        },
        }
      : {}),
  };
};
