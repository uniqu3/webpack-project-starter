// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
exports.TailwindExtractor = content => {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
};
