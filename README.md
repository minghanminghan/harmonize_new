<h1>Harmonize 2.0</h1>

TODO:
x finalize interface design
x build out simple recommendation system (spotify metrics cosine distance)
x implement interface (use sdk for playback, spotify-web-api-node for state management)
x refine db service
o improve recommendation service (spotDL)


<h2>timeline</h2>
 x database
<br> x profile (basic)
<br> x auth
<br> o algorithm (everything)
<br> o frontend (basic)
<br> - friends (everything)
<br> - frontend (remaining)
<br> - profile (remaining)
<br> - server-sent events


<h2>services</h2>

* frontend - react
* database - mongo
* auth
* algorithm actions
* profile actions
* friend actions(?)


<h2>events</h2>

* Create Account
* Create Algo
* Update Algo
* Create Playlist
* Add Song to Playlist
* Add Friend
* Highlight Song on Profile

<h2>data / schema</h2>

* User
  * pref: Algo.id
  * algos: [Algo.id]
  * friends: [User.id]
  * highlight: Song.id

* Algo
  * genres: [String]
  * weights: [Float]
  * log: [(Song.id, Bool)] <-- necessary?

* Song
  * uri: String
  * (attach metadata or )