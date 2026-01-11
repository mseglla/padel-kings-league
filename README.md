# Lliga de Pàdel (MVP Premium)

Web per gestionar una lliga de pàdel entre amics (6 jugadors), amb:
- 1a i 2a divisió
- Temporades **trimestrals**
- Registrar sessions en **3 passos** (jugadors → equips → resultat + ⭐ + gomets)
- Classificació automàtica (Model 1)
- Històric de sessions (amb confirmació abans d'esborrar)
- Gestió de jugadors (alta / activar-desactivar)

## 1) Requisits
- Node.js LTS (v18 o v20)

## 2) Instal·lació
Obre un terminal dins la carpeta del projecte i executa:

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Obre:
- http://localhost:3000

## 3) Login (demo)
Pins demo (pots crear els vostres a **Jugadors**):
- Marc 1111
- Joan 2222
- Pau 3333
- Nil 4444
- Oriol 5555
- Quim 6666

## 4) Regles de punts (Model 1)
- Victòria: 3
- Empat: 1 cadascú
- Derrota: 0
- +0,5 per set guanyat
- Repartit 50/50 entre els 2 jugadors de cada equip

## 5) Tancar temporada
A **Temporades** → "Tancar temporada":
- Pugeu el #1 de 2a i baixa el #3 de 1a
- Condició: mínim 4 sessions jugades dins el trimestre
- Es crea automàticament la temporada següent.
