module.exports = ({ env }) => ({
  seo: {
    enabled: true,
  },
  // S3-compatible upload (Railway bucket) when AWS_BUCKET is set.
  // Local dev leaves it unset → falls back to the default local provider.
  ...(env('AWS_BUCKET')
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
});
