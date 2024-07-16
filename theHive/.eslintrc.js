module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "react-native/react-native": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "requireConfigFile": false,
        "ecmaFeatures": {
            "jsx": true
        },
        "babelOptions": {
            "presets": ["@babel/preset-react"]
        }
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "semi": ["error", "never"],
        "indent": ["error", 2]
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
}