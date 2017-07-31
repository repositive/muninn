Muninn - ᛘᚢᚾᛁᚾ 
---
Huginn (thought) and Muninn (memory) are a pair of ravens that fly all over the world, Midgard, and bring information to the god Odin.

As part of the autocompletion feature, Muninn will "remember" all the lists of words from which it will autocomplete base on given prefix.

It will create and maintain list of the following controlled fields:
  - Diseases 
  - Assay type
  - Technology
  - Tissue type

And for each one will try to get related terms with the help of an ontology for each list.

## Current Implementation

### Indexing

- Every time a dataset is created, **ᛘᚢᚾᛁᚾ**  would check for the controlled fields and check if it value it already in the index to added if is not.

### Autocomplete
- The lists will be stored in a redis database.
- It implements an N-gram algorithm to get the complete words for a given prefix.
- It will return an object with the complete words for each list of controlled vocabulary.

### Related terms [WIP]
- For now it will use the EBI OSL rest API against the following ontologies:
  - EFO: Diseases.
  - BTO: Tissues.
  - BAO: Assays and technologies.

## Usage

**ᛘᚢᚾᛁᚾ** will expose the following handlers to iris:

- status.muninn: Takes no arguments and return and object with information about the service:
  - Version
  - Keys: List of controlled vocabularies
    - n_words: Number of complete words for that list(key).
    - sizeOfSet: Number of actual terms(ngrams) storaged on the redis list.

- action.autocomplete: 
  - Takes a prefix to autocomplete for, and an optional limit for the number of return values.
  ```json
    {
      "prefix": "{prefix}",
      "limit": "{limit}"
    }
  ```
  - It will return and object with and array of complete words for each list in the database.

- action.{controlled field}.autocomplete: Allows to autocomplete just for an specific list.

- event.dataset.create: Listen for creation of datasets in order to check for new words for the list of controlled fields.


