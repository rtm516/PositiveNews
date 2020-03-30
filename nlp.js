// Courtesy of Ebenezer Don (2020) https://blog.logrocket.com/sentiment-analysis-node-js/

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require('natural')
const aposToLexForm = require('apos-to-lex-form')
const SW = require('stopword')

function Preprocess (text) {
  const lexedText = aposToLexForm(text) // [I'm, you're] -> [I am, you are]
  const casedText = lexedText.toLowerCase()
  const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, ' ') // special chars/numbers can't convey sentiment
  return alphaOnlyText
}

function Tokenize (text) {
  const tokenizer = new WordTokenizer()
  const tokenizedText = tokenizer.tokenize(text)
  return tokenizedText
}

function Filter (text) {
  // [but, what, a]
  const filteredText = SW.removeStopwords(text)
  return filteredText
}

function Analyze (text) {
  // numeric polarity of sentiment (good = 1, bad = -1)
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn')
  const analysis = analyzer.getSentiment(text)
  return analysis
}

module.exports.getSentiment = function (text) {
  const PreprocessedText = Preprocess(text)
  const tokenizedText = Tokenize(PreprocessedText)
  const filteredText = Filter(tokenizedText)
  const analysis = Analyze(filteredText)
  return analysis
}
