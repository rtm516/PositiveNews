// Courtesy of Ebenezer Don (2020) https://blog.logrocket.com/sentiment-analysis-node-js/

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require('natural')
const aposToLexForm = require('apos-to-lex-form')
const SW = require('stopword')

// Clean input text
function preprocess (text) {
  // Replace shorthand [I'm, you're] -> [I am, you are]
  const lexedText = aposToLexForm(text)

  // Make all text lowercase
  const casedText = lexedText.toLowerCase()

  // Strip all special chars
  const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, ' ')

  return alphaOnlyText
}

// Break text up into tokens
function tokenize (text) {
  const tokenizer = new WordTokenizer()
  const tokenizedText = tokenizer.tokenize(text)
  return tokenizedText
}

// Remove stopwords such as (but, a, or, what)
function filter (text) {
  const filteredText = SW.removeStopwords(text)
  return filteredText
}

// Work out the numeric polarity of sentiment (good = 1, bad = -1)
function analyze (text) {
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn')
  const analysis = analyzer.getSentiment(text)
  return analysis
}

module.exports.getSentiment = function (text) {
  const PreprocessedText = preprocess(text)
  const tokenizedText = tokenize(PreprocessedText)
  const filteredText = filter(tokenizedText)
  const analysis = analyze(filteredText)

  return analysis
}
