import jenkins.*
import jenkins.model.*
import hudson.*
import hudson.model.*

println "Initialisation Docker..."

// Exécuter le script de permissions Docker
def proc = "chmod 666 /var/run/docker.sock".execute()
proc.waitFor()

println "Docker initialisé"

