# CRM Backend

Ten projekt to backendowa usługa dla systemu Zarządzania Relacjami z Klientami (CRM). Udostępnia API do zarządzania klientami, leadami, sprzedażą oraz powiązanymi operacjami biznesowymi. Zbudowany z myślą o skalowalności i bezpieczeństwie, wspiera integrację z różnymi klientami frontendowymi oraz usługami zewnętrznymi.

## Funkcje

- Zarządzanie klientami i leadami
- Śledzenie sprzedaży i raportowanie
- Uwierzytelnianie i autoryzacja użytkowników (JWT)
- RESTful API
- Integracja z bazą danych MongoDB

## Technologie

- Node.js / Express.js
- MongoDB
- JWT do uwierzytelniania

## Jak zacząć

1. Sklonuj repozytorium.
2. Skonfiguruj MongoDB:
    - Utwórz bazę danych `crm-db`
    - Utwórz kolekcję `clients`
    - Utwórz kolekcję `notes`
    - Utwórz kolekcję `reminders`
    - Utwórz kolekcję `sales`
    - Utwórz kolekcję `users`
3. Zainstaluj zależności: `npm install`
4. Skonfiguruj zmienne środowiskowe w pliku `.env`.
5. Uruchom serwer: `npm start` lub `npm run dev`

## Licencja

MIT