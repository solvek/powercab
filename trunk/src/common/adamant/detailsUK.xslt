<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/opt">
		<div>
			<h1>Загальна інформація</h1>
			<table border="2">
				<tbody>
					<tr>
						<td><b>Абонент</b></td>
						<td><xsl:value-of select="g_data/@name"/></td>
					</tr>
					<tr>
						<td><b>Баланс</b></td>
						<td><xsl:value-of select="g_data/@account"/></td>
					</tr>
					<tr>
						<td><b>Статус</b></td>
						<td><xsl:value-of select="g_data/@state"/></td>
					</tr>
					<tr>
						<td><b>Тип</b></td>
						<td><xsl:value-of select="g_data/@tarif_name"/></td>
					</tr>
					<tr>
						<td><b>Ліміт трафіку</b></td>
						<td><xsl:value-of select="limit/@limit"/></td>
					</tr>
					<tr>
						<td><b>Абонплата</b></td>
						<td><xsl:value-of select="g_data/@tarif_abonfee"/></td>
					</tr>
					<tr>
						<td><b>Дата актуальності</b></td>
						<td><xsl:value-of select="g_data/@timestamp"/></td>
					</tr>
				</tbody>
			</table>
			<h1>Використання трафіку</h1>
			<table border="2">
				<tbody>
					<tr>
						<td><b>Напрямок</b></td>
						<td><b>Вхідний</b></td>
						<td><b>Вихідний</b></td>
						<td><b>Сумарний</b></td>
					</tr>
					<xsl:for-each select="traf_cnt">
						<tr>
							<td>
								<xsl:choose>
									<xsl:when test="@title"><xsl:value-of select="@title"/></xsl:when>
									<xsl:otherwise><xsl:value-of select="@name"/></xsl:otherwise>
								</xsl:choose>
							</td>
							<td><xsl:value-of select="@rx"/></td>
							<td><xsl:value-of select="@tx"/></td>
							<td><xsl:value-of select="@sum"/></td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</div>
	</xsl:template>
</xsl:stylesheet>
