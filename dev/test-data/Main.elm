module Main exposing (main)

import Browser
import Html exposing (h1, text)
import Html.Attributes exposing (class)
import Styles.Index


main =
    h1 [ class Styles.Index.anotherClass ] [ text "Hello, Elm parcel plugin!" ]
