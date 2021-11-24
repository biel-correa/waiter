# Waiter extension

Do you hate having to run all those commands every time when you open up a folder? Now you can set a JSON whit all the terminal tabs and commands that it should run.

## Features

The gif can show you what I'm talking about, you just open the folder and everything is setup for your development session 

![initializing](https://user-images.githubusercontent.com/56176344/143320917-12fe3516-36af-4ec5-a073-5c2dd9abdc46.gif)

## Requirements

The Waiter needs a JSON file so that he knows what you want, but don't worry as soon as it runs he'll ask you to create it.

![askingToCreate](https://user-images.githubusercontent.com/56176344/143320932-031c68c4-440d-4476-8fbc-d9a08b369614.png)

If you prefer to do things by hand you can create a file with the name ```waiter.config.json``` and add the base structure:

```json
{
    "tabs": [
        {
            "tabName": "Custom tab name",
            "commands" : [
                "echo 'Hello world'"
            ]
        }
    ]
}
```

> A tabName isn't required but nice to have

<!-- # Contributing

For more information on contributing see [Contributing.md]('https://github.com/biel-correa/waiter/blob/master/CONTRIBUTING.md')

> create contributing.md -->
