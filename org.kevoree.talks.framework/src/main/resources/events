INITIALIZE => start the initialization of the plugins (trigger by kslideshow and kslideshowKeynoteMaster)
INITIALIZED => to notify that a plugin has finished its initialization (trigger by plugins and managed by kslideshow and kslideshowKeynoteMaster)
RUN => start plugins (trigger by kslideshow and kslideshowKeynoteMaster)

SLIDE => enter in slide mode (only one slide is displayed)
LIST => enter in list mode (all the slide are displayed)

START => go to the first slide
END => go to the last slide
FORWARD =>
BACK =>
SET_SLIDE => to active a specific slide (! this event is an internal event to manage inner transition. It's better to use SET_POSITION instead of this one when you create new plugin)
    attributes:
        slideNumber: the nth slide must be activated
        previousSlideNumber: the previous slide which was activated

FULLSCREEN => go to Full screen

NOTES => send details inner html of a specific slide
    attribute:
        notes
GET_NOTES => ask details for a specific slide
LENGTH => send the number of slides there are
    attribute:
        length
GET_LENGTH => ask the number of slides there are
POSITION => send the current position so the current slide number
    attribute:
        position
SET_POSITION => ask to set the current slide as the one corresponding to the posuition defined
    attribute:
        position
GET_POSITION => ask for the current slide number

EMPTY_SLIDE => ask to add an empty slide
    attribute:
        position: the position where the empty slide must be included
REMOVE_SLIDE => ask to remove a slide from the presentation
