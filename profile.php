<?php
include 'header.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profiel pagina</title>
    <link rel="stylesheet" href="style/style.css">

    <style>

        body {
            background-color: #6d28d9;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #fff;
        }
        
        main {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            display: flex;
            gap: 30px;
            margin-bottom: 25px;
            align-items: center;

        }

        figure {
            width: 180px;
            height: 180px;
            background-color: #000000;
            border-radius: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 4rem;
            margin: 0;
        }

        .profile-info {
            flex: 1;
        }

        .profile-info h1 {
            margin: 0 0 5px 0;
            font-size: 2rem;
            color: #ffffff;
        }

        .username {
            font-size: 1.1rem;
            color: #ffffff;
            margin: 0 0 15px 0;
        }

        .bio {
            font-size: 1rem;
            line-height: 1.5;
            color: #ffffff;
            margin: 0 0 10px 0;
        }

        hr {
            height: 3px;
            background-color: #ffffff;
            margin: 5px 0;
            border: none;
            border-radius: 4px;
        }

        .status-bar {
            background-color: #ec4899;
            color: #fff;
            padding: 10px 15px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
        }

        section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        article {
            background-color: #ec4899;
            color: #fff;
            padding: 20px;
            border-radius: 6px;
            min-height: 200px;
        }

        article h2 {
            margin-top: 0;
            font-size: 1.25rem;
            border-bottom: 2px solid #555;
            padding-bottom: 8px;
            color: #ddd;
        }

        article ul {
            list-style: none;
            padding: 0;
            margin: 10px 0 0 0;
        }

        article li {
            padding: 8px 0;
            border-bottom: 1px solid #555;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        article li:last-child {
            border-bottom: none;
        }

        .friend-status {
            font-size: 0.8rem;
            color: #ccc;
        }
    </style>
</head>
<body>

<main>
    <header>
        <figure>👤</figure>
        
        <section class="profile-info">
            <h1>Alex Mercer</h1>
            <p class="username">@GamerX_2026</p>
            <p class="bio">Just a casual gamer looking for co-op campaigns and competitive grinds. Let's team up!</p>
        </section>
    </header>

    <hr>
    <p class="status-bar">Playing: Elden Ring</p>
    <hr>

    <section>
        <article>
            <h2>Badges</h2>
            <ul>
                <li>🏆 MVP</li>
                <li>🥇 Beta Tester</li>
                <li>⭐ Top Contributor</li>
            </ul>
        </article>

        <article>
            <h2>Friends</h2>
            <ul>
                <li>
                    <span>🟢 ShadowNinja</span>
                    <span class="friend-status">Online</span>
                </li>
                <li>
                    <span>🔵 PixelQueen</span>
                    <span class="friend-status">In-Game</span>
                </li>
                <li>
                    <span>⚫ LootGoblin</span>
                    <span class="friend-status">Offline</span>
                </li>
                <li>
                    <span>🟢 SpeedRunner</span>
                    <span class="friend-status">Online</span>
                </li>
            </ul>
        </article>

        <article>
            <h2>Games</h2>
            <ul>
                <li>Cyberpunk 2077</li>
                <li>Elden Ring</li>
                <li>Valorant</li>
                <li>Minecraft</li>
            </ul>
        </article>

        <article>
            <h2>Inventory</h2>
            <ul>
                <li>Legendary Sword Skin</li>
                <li>Golden Helmet</li>
                <li>XP Boost x5</li>
            </ul>
        </article>
    </section>
</main>

</body>
</html>