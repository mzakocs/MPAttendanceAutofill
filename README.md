# MPAttendanceAutofill
> An autofill helper for Mountain Pointe High School attendance forms.  

A simple extension for auto-filling Mountain Pointe High School attendance forms and keeping track of them throughout the day. 

## Images

![Popup](images/screenshot.png)

## Files

* popup.js
    * The main file for the extension. Injects a script into an attendance form to auto-fill it, keeps track of when they've been completed, and allows you to easily open class meetings.
* options.js
    * This is where the user configures the extension. Allows them to input all of their class attendance links, meeting links, and their student information.

## Release History

* 2.0
    * Added the ability to easily open meeting links in the extension popup.
    * Added the ability to create aliases for different classes. For example, you can now have a class labeled as "World History" instead of just "Period 1."
    * Added clearer instructions for the basic operation off the extension after criticism of the initial documentation.
    * Heavily improved the layout & styling of the popup and options menus.
    * Added a light theme to the options menu that is triggered by CSS media queries.
    * Improved the comments on many different parts of the source code.
    * Fixed a bug where the red X next to a recently auto-filled form wouldn't change to a green checkmark until the extension menu was closed and re-opened.

* 1.1
   * Fixed some small bugs/issues that were reported from the first release.
   * Created a longer time buffer between the data input and the data submission on the form auto-fill script.

* 1.0
    * First Release

## Meta

Mitch Zakocs – mitchell.zakocs@pridetronics.com  

[https://github.com/mzakocs/](https://github.com/mzakocs/)  

Distributed under the MIT License. See ``LICENSE`` for more information.

## How To Use

There are two ways to use this extension:
1. Clone the repository and add the extension through developer mode in Google Chrome. This is not recommended as you will not receive any updates to the extension without regularly pulling from the GitHub repo.
2. Go [https://chrome.google.com/webstore/detail/mountain-pointe-attendanc/haebcphbipdknaapbphajndkgdlmeaig](here) and download the extension from the Chrome store. This is the recommended method as you will automatically receive updates as they are released.

## Contributing

1. Fork it (<https://github.com/mzakocs/MPAttendanceAutofill>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
