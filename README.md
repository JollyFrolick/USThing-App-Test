# Welcome to your new ignited app!

> The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

- [Quick start documentation](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/Boilerplate.md)
- [Full documentation](https://github.com/infinitered/ignite/blob/master/docs/README.md)

## Getting Started

```bash
yarn install
yarn start
```

To make things work on your local simulator, or on your phone, you need first to [run `eas build`](https://github.com/infinitered/ignite/blob/master/docs/expo/EAS.md). We have many shortcuts on `package.json` to make it easier:

```bash
yarn build:ios:sim # build for ios simulator
yarn build:ios:device # build for ios device
yarn build:ios:prod # build for ios device
```

### `./assets`

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `icons` and `images`:

```tree
assets
├── icons
└── images
```

**icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.

Ignite comes with a built-in `Icon` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/app/components/Icon.md).

**images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

Another valuable built-in component within Ignite is the `AutoImage` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-AutoImage.md).

How to use your `icon` or `image` assets:

```typescript
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('assets/images/my_image.png')} />
  );
};
```

## Running Maestro end-to-end tests

Follow our [Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe.

## Next Steps

### Ignite Cookbook

[Ignite Cookbook](https://ignitecookbook.com/) is an easy way for developers to browse and share code snippets (or “recipes”) that actually work.

### Upgrade Ignite boilerplate

Read our [Upgrade Guide](https://ignitecookbook.com/docs/recipes/UpdatingIgnite) to learn how to upgrade your Ignite project.

## Community

⭐️ Help us out by [starring on GitHub](https://github.com/infinitered/ignite), filing bug reports in [issues](https://github.com/infinitered/ignite/issues) or [ask questions](https://github.com/infinitered/ignite/discussions).

💬 Join us on [Slack](https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1f137np4h-zPTq_CbaRFUOR_glUFs2UA) to discuss.

📰 Make our Editor-in-chief happy by [reading the React Native Newsletter](https://reactnativenewsletter.com/).

## Local course data

Run `yarn prepare:courses` from the project root after changing the supplied
`courses.json`. The script validates the required fields and unique semester/course
IDs, then writes `app/data/courses.json` with only the fields in `Course`.
The original dataset is unchanged; all semesters and prerequisite text are retained.
Keep the generated file in the repository so the app can run without preparation.

Both course screens use `app/services/courses.ts`. It loads the reduced JSON locally
and builds semester and course lookup indexes once. The catalogue currently shows
2026-27 Fall (`2610`), sorted by course code. The service also exposes semester and
department lists for future filters. Details are matched by both course ID and semester.
No network connection is required for course data.

This approach still loads all prepared records into memory at startup. Semester
splitting is a possible later improvement if device measurements show slow startup.
The catalogue supports semester and department selection and code/title search.

### Prerequisite exploration

The detail screen extracts explicit four-letter department codes plus four-digit
course numbers and optional letter suffixes (for example `COMP 1022P`). Spaces and
case are normalized, and repeated references in one sentence are deduplicated.
Original prerequisite text is preserved because extraction does not interpret
AND/OR, grades, programme restrictions, or shorthand references without a prefix.

Referenced courses are resolved only within the selected semester. Missing records
are labelled instead of substituting a different semester. Each available course
opens its details, and expandable rows reveal deeper prerequisites on demand.
A path of ancestor course codes stops cycles; the same course can still appear in
separate branches. Courses without prerequisites and text without extractable
course codes have explicit explanations. Expansion is local to each detail screen.

