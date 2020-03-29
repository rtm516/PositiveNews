//Courtesy of Ebenezer Don (2020) https://blog.logrocket.com/sentiment-analysis-node-js/

const express = require('express');
const natural = require('natural');

//const router = express.Router();

export function getSentiment(article)
{
  //Pre-processing
  const lexedArticle = aposToLexForm(article); //[I'm, you're] -> [I am, you are]
  const casedArticle = lexedArticle.toLowerCase();
  const alphaOnlyArticle = casedArticle.replace(/[^a-zA-Z\s]+/g, ' ');//special chars/numbers can't convey sentiment

  //Tokenisation
  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedArticle = tokenizer.tokenize(alphaOnlyArticle);

  //Spelling corrections
  tokenizedArticle.forEach((word, index) => {
    tokenizedArticle[index] = spellCorrector.correct(word);
  })

  //Remove stopwords (but, a, or, what)
  const filteredArticle = SW.removeStopwords(tokenizedArticle);

  //Sentiment analysis
  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(filteredArticle);

  return analysis; //numeric polarity of sentiment (good = 3, bad = -3)
}