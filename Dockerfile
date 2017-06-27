FROM picoded/tomcat

MAINTAINER Tomasz Goluch <goluch@eti.pg.gda.pl>

ADD /target/TreeCmpGUI-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/TreeCmp.war

CMD ["catalina.sh", "run"]