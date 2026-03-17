FROM openjdk:22-jdk
COPY travellers_choice/target/travellers-pick.jar /travel-app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/travel-app.jar"]