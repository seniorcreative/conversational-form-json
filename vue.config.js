module.exports = {
  pluginOptions: {
    s3Deploy: {
      awsProfile: 'default',
      endpoint: 'Override the default AWS endpoint with another e.g. DigitalOcean.',
      region: 'ap-southeast-2',
      bucket: 'conversational-form-tool',
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pwa: true,
      pwaFiles: 'index.html,service-worker.js,manifest.json',
      enableCloudfront: false,
      cloudfrontId: 'The ID of the distribution to invalidate',
      cloudfrontMatchers: 'A comma-separated list of paths to invalidate (default: /*)',
      uploadConcurrency: 5,
      cacheControl: 'Sets cache-control metadata for all uploads, overridden for individual files by pwa settings',
      gzip: false,
      gzipFilePattern: 'Pattern for matching files to be gzipped. (By default: \'**/*.{js,css,json,ico,map,xml,txt,svg,eot,ttf,woff,woff2}\')',
      registry: undefined,
      overrideEndpoint: false,
      pluginVersion: '4.0.0-rc3'
    }
  }
}
