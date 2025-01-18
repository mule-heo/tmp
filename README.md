# vanilla-template

## Prerequisites

- Node.js lts/jod
- Yarn v4.6

You can download SDKs for Yarn from the following link:

- [Yarn SDKs](https://yarnpkg.com/getting-started/editor-sdks)

## Build

This project uses Parcel to build. Run the following command to build the project:

```sh
yarn build
```

## Deployment

You can deploy the built project using any static site hosting service. The built files are located in the `dist` directory.

## PWA (Progressive Web App)

This project leverages a service worker to ensure that the page can be accessed even when the user is offline. If you'd prefer not to use the service worker functionality, simply remove the service-worker.js file and the corresponding code blocks from scripts/index.js.

## Author

- mule-heo

## License

This project is licensed under the MIT License.
