# SpongeBase
Interactive data mash-up of Lebanon's locations and interventions

A joint project by UNHCR/UNICEF Innovation leads in Lebanon.

## Project overview

Data on geographical locations (governorates, districts, cities, villages, camps, schools etc…) in a humanitarian response is often scattered in different locations, whether in databases, folders, assessment reports, and information sharing websites. A lot of effort is spent on collating available information for secondary data reviews as well as for profiling certain geographical location for operational importance.
The idea of this project is to automatically collate available information from different data sources in a simple format and linking them to a geographical location like a governorate, district, village or even a small camp.
SpongeBase is composed of a dynamic map interface (SpongeMap) and a web app/interface (DOG).

SpongeMap has only the Common and Fundamental Operational Data Sets (CoDs and FoDs) preloaded. The DOG is a web application and web API that links to existing information systems and remote folders (like Dropbox). Sponemap sends a request for information regarding a certain location and the DOG fetches all available information even from excel files in dropbox folders, packages it and sends it back to be displayed on the map.  
Not only will this project help collating information but it has the potential to revolutionize the way we look at Who What Where (3W) information. Partners would fill a simple template, store it in a dropbox and the information becomes available to other actors on a map and all in one simple readable format. Agencies wanting to work in a specific area would go to the map, zoom in to a location and retrieve key information whether population figures, key indicators, implemented projects, or major/minor events or issues that happened in that location. With all this knowledge base, agencies would then decide if this is an area that requires their intervention.


## Code

### Get in to docker containers

61d103150e85
