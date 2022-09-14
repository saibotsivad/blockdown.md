# Blockdown

Specification for an addition to the familiar Markdown syntax, with a delimiter to support block-level text sections.

## Table of contents

## Introduction

If you are using Markdown with Front Matter, your existing Markdown files are probably already valid Blockdown! 🎉

Blockdown does not have opinions about which flavor of Markdown you should use, or which plugins you should support.

Instead, it is a specification (with an [implementation](https://github.com/saibotsivad/blockdown)) that defines text blocks in such a way that *you* can decide what to do with them.

## Why?

A typical Markdown file with metadata might look like this:

```
---
title: My Dataviz Post
---

Here is my cool post.
```

Suppose that you want to include a graph in the middle, using a library like [mermaid](https://mermaidjs.github.io/)?

You might be tempted to write HTML in your Markdown, something like this:

```
---
title: My Post
---

Here is my cool post, with a chart.

<div class="mermaid" data-size="large">
    pie title NETFLIX
        "Time spent looking for movie" : 90
        "Time spent watching it" : 10
</div>

Isn't that the truth.
```

Somewhere after you convert the Markdown file to HTML, on the server or browser, you would use some technique to look for elements with the appropriate CSS selector, grab the text, generate a chart, then plug it back in to your HTML.

You could do that, but... what if there was a better way? 🤔

## How it Works

With Blockdown, you define each block of text explicitly, using a delimiter that's easy for humans and computers alike to read:

* `---!name` The delimiter **must** have a name. This should usually be the content type, e.g. `mermaid` or `table`.
* `---!name#id` It can also include an identifier, if you need to identify a block uniquely within the document.
* `---!name[metadata]` It can also include metadata, for things like display settings or anything else.
* `---!name#id[metadata]` Of course, it can include an identifier *and* metadata.

> Note: The metadata is enclosed in square brackets, but the exact syntax of the metadata is **not** specified by Blockdown. Blockdown syntax ***does not care***–it leaves metadata interpretation up to you.

The earlier `mermaid` example, written in the explicit format, would be:

```
---!yaml
title: My Post

---!md

Some exciting words.

---!mermaid[size=large]

pie title NETFLIX
    "Time spent looking for movie" : 90
    "Time spent watching it" : 10

---!md

More words.
```

## Delimiter Specifications

Blockdown syntax doesn't care what the block names or contents are, it only cares about separating the text contents into blocks, and leaves the interpretation of those blocks up to you.

Delimiter *names* and *identifiers* must only use "safe" characters, which are the following:

* U+0061 to U+007A, e.g. `a-z`
* U+0041 to U+005A, e.g. `A-Z`
* U+0030 to U+0039, e.g. `0-9`
* U+002D HYPHEN-MINUS, e.g. `-`
* U+005F LOW LINE, e.g. `_`

Each block delimiter contains the following possible components:

### `fence` *(required)*

The start of a new Blockdown section are the exact characters `---!` with no leading spaces.

If a fence is started in a Markdown backtick-fenced section, it must be ignored. For example, this `yaml` fence is ignored:

``````md
Markdown words.
```
---!yaml
key: value
```
The above Blockdown fence must be ignored by Blockdown.
``````

### `name` *(required)*

The name of the block, e.g. for `---!yaml` the `name` would be `yaml`.

### `id` *(optional)*

An identifier for the block, e.g. for `---!yaml#abc` the `id` would be `abc`.

Blockdown does not require identifiers to be unique, but since they are generally mapped to HTML identifiers they should be unique within a document.

### `metadata` *(optional)*

Additional metadata for the block is between square brackets, e.g. for `---!yaml#abc[foo]` or `---!yaml[foo]` the `metadata` would be `foo`.

Blockdown also supports multi-line metadata by ending the first line of the delimiter with `[` (the left square bracket), and closing the metadata section with a line containing only the `]` character (right square bracket).

The string characters considered "metadata" are all characters, including newlines, after the left square bracket and before the right square bracket.

For example:

```
---!mermaid[
size = large
color = red
]

pie title NETFLIX
    "Time spent looking for movie" : 90
    "Time spent watching it" : 10
```

The "metadata" string would be:

```
\nsize = large\ncolor = red\n
```

Although the example shows a TOML-like syntax, it is important to note that Blockdown does **not** have an opinion about the format of the metadata, including indentation, so the following examples are equally valid *to the Blockdown specifications*.

```
---!mermaid[
  size = large
  color = red
]
---!mermaid[
  size: large
  color: red
]
---!mermaid[{
  size: 'large',
  color: 'red',
}]
```

### `content` *(optional)*

Any characters following the completed block delimiter, up to the next block delimiter or the end of the file, except that the newlines before and after are omitted.


## Backwards Compatibility

For backwards compatibility with Markdown + [Front Matter](https://jekyllrb.com/docs/front-matter/) documents, if the very first line is `---` then the following block is interpreted as Front Matter, up to the next Blockdown delimiter or `---` separator.

If the `---` separator is used (instead of a Blockdown delimiter), the following block is treated as Markdown.

So our earlier explicit example could simply be:

```
---
title: My Post
---

Some exciting words.

---!mermaid[size=large]

pie title NETFLIX
    "Time spent looking for movie" : 90
    "Time spent watching it" : 10

---!md

More words.
```

## License

The project code and all specs are published under the [Very Open License](http://veryopenlicense.com/).