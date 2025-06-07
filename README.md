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
3. Przejdź do katalogu `backend`
4. Zainstaluj zależności: `npm install`
5. Skonfiguruj zmienne środowiskowe w pliku `.env`.
6. Uruchom serwer: `npm run dev`

---

# CRM Frontend

Prosty frontend z dashboardem oraz listą klientów, sprzedaży oraz pracowników.

## Technologie

- React.js
- React Router DOM
- Tailwind CSS
- Recharts

## Jak zacząć

1. Przejdź do katalogu `frontend`
2. Zainstaluj zależności: `npm install`
3. Uruchom aplikację: `npm start`

## Licencja

MIT
