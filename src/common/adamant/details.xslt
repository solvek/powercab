<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/opt">
		<html>
			<head>
				<title>PowerCab: Detailed information</title>
			</head>
			<body>
			<h1>Загальна інформація</h1>
			<table border="2">
				<tbody>
					<tr>
						<td><b>Balance</b></td>
						<td><xsl:value-of select="g_data/@account"/></td>
					</tr>
					<tr>
						<td><b>Traffic limit</b></td>
						<td><xsl:value-of select="limit/@limit"/></td>
					</tr>
					<tr>
						<td><b>Type</b></td>
						<td><xsl:value-of select="limit/@type"/></td>
					</tr>
					<tr>
						<td><b>Абонент</b></td>
						<td><xsl:value-of select="g_data/@name"/></td>
					</tr>
					<tr>
						<td><b>Time actuality</b></td>
						<td><xsl:value-of select="g_data/@timestamp"/></td>
					</tr>
				</tbody>
			</table>
			<h1>Traffic</h1>
			<table border="2">
				<tbody>
					<tr>
						<td><b>Direction</b></td>
						<td><b>Input</b></td>
						<td><b>Output</b></td>
					</tr>
					<xsl:for-each select="traf_cnt">
						<tr>
							<td><xsl:value-of select="@name"/></td>
							<td><xsl:value-of select="@rx"/></td>
							<td><xsl:value-of select="@tx"/></td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
			<h1>Usefull links</h1>
			<a href="https://cabinet.homenet.adamant.ua/">Кабінет</a><br/>
			<a href="http://forum.homenet.adamant.ua/">Forum</a><br/>
			<a href="http://homenet.adamant.ua/">Adamant Homenet</a><br/>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
