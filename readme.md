# Markdown Deck

## What is Markdown Deck
Markdown *Deck* is an educational app that works with markdown files. It converts your markdown notes into flashcards. 

## Structure of Markdown File
For Markdown Deck to function properly it expects following structure:

```
# Document Title

## Question 1

answer to **Question 1**

## Question 2: Latex suppport 

You can include latex equations, tables, code samples, etc. 
```


## Formatting Support

All the formatting supported by Markdown is supported by Markdown deck.

## Latex Support

**Inline Latex Expression**

For inline representation, surround latex expression by `$` sign. 
Example `$\bar{x} = \left(\sum_{i=0}^N x_i \right)/N$` get represented as $\bar{x} = \left(\sum_{i=0}^N x_i \right)/N$. Note that there shouldn't be any white space between `$` and latex expression. 

**Block Latex Expression**

To represent equation as a block, surround latex expression by `$$`. Example

$$\bar{x} = \frac{\sum_{i=0}^{N}x_i}{N}$$

## Keyboard Navigation

Markdown Deck is designed to easily navigate via keyboard. Following keyboard navigations are supported

| Keyboard Shrotcut | Description |
|:-----------------:|-------------|
| $\rightarrow$ | Move to next card |
| $\leftarrow$ | Move to previous card |
| $\uparrow$ | Move up to a card in the previous row|
| $\downarrow$ | Move down to a card in the next row |
| o | Open flashcard|
| ESC | close flashcard |
| / | Focus on search box. Pressing enter within the search box will take focus back to the first returned card |




