**Anleitung, um das Backend zu starten**  
Das Backend besteht aus zwei Komponenten: Dem MongoDB-Server und dem Node.js-Server.  
Voraussetzung auf dem Zielsystem ist, dass MongoDB installiert ist. Getestet ist es mit Version 4.0.4 auf Ubuntu 18.04.
Im Lieferumfang ist ein Backup der gesamten Datenbank mit Testdaten inklusive eines Admin-Nutzers vorhanden. Das Backup kann mittels des Befehls **mongorestore dump/** im Terminal eingespielt werden. Das Terminal muss sich im Verzeichnis befinden, in dem sich der Ordner dump befindet.
Um die Datenbank mit Authentifizierungsschutz zu starten, muss "mongod --auth" eingetippt werden. Der Server lässt sich auch ohne --auth starten.
Die Testdaten befinden sich in der Collection "sandbox".
Im Node.js-Server befindet sich im Hauptverzeichnis die **config.js**, in der die IP, Benutzerdaten der Datenbank und Port von Node.js hinterlegt sind. Der Node.js-Server lässt sich folgendermaßen im Terminal starten:
- Sich mit dem Terminal in das Verzeichnis begeben, in dem die app.js liegt
- **npm install**
- **node app.js**