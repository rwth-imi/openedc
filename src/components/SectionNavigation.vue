<template>
  <div class="overflow-auto">
    <div class="mt-3">
      <b-pagination-nav
        :pages="pages"
        :link-gen="linkGen"
        use-router
        align="fill"
      ></b-pagination-nav>
    </div>
  </div>
</template>
<script>
export default {
  props: ["sections", "crfId"],
  data() {
    return {};
  },
  created() {
    this.createPages();
  },
  methods: {
    linkGen(pageNum) {
      return {
        path: "/CRF/" + this.crfId + "/" + (pageNum - 1),
        params: {
          crfId: this.crfId,
          section: pageNum - 1
        }
      };
    },
    createPages() {
      this.pages = [];
      this.sections.forEach((section, i) => {
        this.pages.push({
          text: section.title
        });
      });
      console.log("pages", this.pages, this.sections);
    }
  }
};
</script>
